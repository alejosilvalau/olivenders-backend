import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Mage } from './mage.entity.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const mageZodSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  role: z.string(),
  school: z.string().uuid(),
});

const em = orm.em;

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  const validatedInput = mageZodSchema.parse(req.body);

  req.body.sanitizedInput = {
    username: validatedInput.username,
    password: validatedInput.password,
    name: validatedInput.name,
    last_name: validatedInput.last_name,
    email: validatedInput.email,
    address: validatedInput.address,
    phone: validatedInput.phone,
    role: validatedInput.role,
    school: validatedInput.school,
  };

  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const mages = await em.find(Mage, {}, { populate: ['school'] });
    res.status(200).json({ message: 'Mages fetched', data: mages });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmailOrUsername(req: Request, res: Response) {
  try {
    const { username, email } = req.params;
    const excludeMageId = req.query.excludeMageId;

    const query: any = { $or: [] };

    if (username) query.$or.push({ username });
    if (email) query.$or.push({ email });
    if (excludeMageId) query.id = { $ne: excludeMageId };

    const mageFound = await em.findOne(Mage, query, { populate: ['school'] });

    if (!mageFound) {
      return res.status(200).json({ message: 'Mage not found', data: null });
    }

    return res.status(200).json({ message: 'Mage found', data: mageFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmailRecipient(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const mageFound = await em.findOneOrFail(Mage, { email }, { populate: ['school'] });
    if (!mageFound) {
      return res.status(409).json({ message: 'Mage not found', data: null });
    }
    res.status(200).json({ message: 'Mage found', data: mageFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const mage = await em.findOneOrFail(Mage, { id }, { populate: ['school'] });
    if (!mage) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    }
    res.status(200).json({ message: 'Mage found', data: mage });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmail(email: string) {
  try {
    const mage = await em.findOne(Mage, { email }, { populate: ['school'] });
    return mage;
  } catch (error: any) {
    return error.message;
  }
}

async function findOneByUser(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const mage = await em.findOne(Mage, { username }, { populate: ['school'] });
    if (!mage) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    } else {
      res.status(200).json({ message: 'Mage found', data: mage });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function login(req: Request, res: Response) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const mageFound = await em.findOne(Mage, { username }, { populate: ['school'] });

    if (!mageFound) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    } else {
      const isMatch = await bcrypt.compare(password, mageFound.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password', data: null });
      }
      const token = jwt.sign({ id: mageFound.id, role: mageFound.role }, process.env.SECRET_KEY_WEBTOKEN!, {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', data: { user: mageFound, token: token } });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function validatePassword(req: Request, res: Response) {
  try {
    const mageId = req.params.id;
    const currentPassword = req.body.password;
    const mage = await em.findOne(Mage, { id: mageId }, { populate: ['school'] });
    if (!mage) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    } else {
      const isMatch = await bcrypt.compare(currentPassword, mage.password);
      res.status(200).json({ message: 'Password validation completed', data: isMatch });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Implement password reset with token functionality
// async function validateToken(req: Request, res: Response) {
//   try {
//     const token = req.params.token;
//     const tokenEntity = await em.findOne(PasswordResetToken, { token });
//     if (!tokenEntity || tokenEntity.expiryDate < new Date()) {
//       return res.status(404).json({ ok: false, message: 'Token inválido o expirado' });
//     }
//     return res.status(200).json({ ok: true, message: 'Token válido' });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function checkUsername(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const mageFound = await em.findOne(Mage, { username });
    if (!mageFound) {
      return res.status(200).json({ message: 'Username available', data: false });
    } else {
      return res.status(200).json({ message: 'Username already exists', data: true });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function checkEmail(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const mageFound = await em.findOne(Mage, { email });
    if (!mageFound) {
      return res.status(200).json({ message: 'Email available', data: false });
    } else {
      return res.status(200).json({ message: 'Email already exists', data: true });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response) {
  try {
    const existingMage = await em.findOne(Mage, {
      $or: [{ username: req.body.sanitizedInput.username }, { email: req.body.sanitizedInput.email }],
    });

    if (existingMage) {
      return res.status(409).json({ message: 'Mage already exists', data: null });
    }
    if (req.body.sanitizedInput.password.length >= 6) {
      const hashRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.sanitizedInput.password, hashRounds);

      const mage = em.create(Mage, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
      });

      await em.flush();

      // Remove password from response for security
      const mageData = { ...mage, password: undefined };
      res.status(201).json({ message: 'Mage created successfully', data: mageData });
    } else {
      res.status(400).json({ message: 'Password must be at least 6 characters', data: null });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, data: null });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const mageToUpdate = await em.findOneOrFail(Mage, { id }, { populate: ['school'] });

    if (!mageToUpdate) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    } else {
      if (req.body.sanitizedInput.password) {
        return res.status(400).json({ message: 'Cannot modify password from update endpoint', data: null });
      }

      // Ensure phone number is stored as string
      const mageData = {
        ...req.body.sanitizedInput,
        phone: req.body.sanitizedInput.phone ? req.body.sanitizedInput.phone.toString() : mageToUpdate.phone,
      };

      em.assign(mageToUpdate, mageData);

      await em.flush();

      // Remove password from response for security
      const responseData = { ...mageToUpdate, password: undefined };
      res.status(200).json({ message: 'Mage updated successfully', data: responseData });
    }
  } catch (error: any) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: error.message || 'Unknown error', data: null });
  }
}

async function resetPasswordWithoutToken(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const newPassword = req.body.newPassword;

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters', data: null });
    }

    const mage = await em.findOne(Mage, { id }, { populate: ['school'] });
    if (!mage) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    }
    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, hashRounds);
    mage.password = hashedPassword;
    await em.persistAndFlush(mage);

    // Remove password from response for security
    const mageData = { ...mage, password: undefined };
    return res.status(200).json({ message: 'Password updated successfully', data: mageData });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Implement password reset with token functionality
// async function resetPassword(req: Request, res: Response) {
//   try {
//     const { token, newPassword } = req.body;

//     if (newPassword.length < 6) {
//       return res.status(400).json({ ok: false, message: 'La contraseña debe tener al menos 6 caracteres' });
//     }
//     const tokenEntity = await orm.em.findOne(PasswordResetToken, { token });
//     if (!tokenEntity || tokenEntity.expiryDate < new Date()) {
//       return res.status(400).json({ ok: false, message: 'Token inválido o expirado' });
//     }

//     const user = await orm.em.findOne(Usuario, tokenEntity.user.id);
//     if (!user) {
//       return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
//     }
//     const vecesHash = 10;
//     const hashClave = await bcrypt.hash(newPassword, vecesHash);
//     user.clave = hashClave;
//     await orm.em.persistAndFlush(user);
//     await orm.em.removeAndFlush(tokenEntity);
//     return res.status(200).json({ ok: true, message: 'Contraseña actualizada exitosamente' });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const mage = await em.findOne(Mage, { id }, { populate: ['school'] });

    if (!mage) {
      return res.status(404).json({ message: 'Mage not found', data: null });
    } else {
      await em.removeAndFlush(mage);
      res.status(200).json({ message: 'Mage deleted successfully', data: null });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export {
  sanitizeUsuarioInput,
  findAll,
  findOneByEmailOrUsername,
  findOneByEmailRecipient,
  findOneById,
  findOneByUser,
  login,
  validatePassword,
  checkUsername,
  checkEmail,
  add,
  update,
  resetPasswordWithoutToken,
  remove,
};