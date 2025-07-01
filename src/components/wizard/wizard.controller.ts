import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Wizard } from './wizard.entity.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const wizardZodSchema = z.object({
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
  const validatedInput = wizardZodSchema.parse(req.body);

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
    const wizards = await em.find(Wizard, {}, { populate: ['school'] });
    res.status(200).json({ message: 'Wizards fetched', data: wizards });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmailOrUsername(req: Request, res: Response) {
  try {
    const { username, email } = req.params;
    const excludeWizardId = req.query.excludeWizardId;

    const query: any = { $or: [] };

    if (username) query.$or.push({ username });
    if (email) query.$or.push({ email });
    if (excludeWizardId) query.id = { $ne: excludeWizardId };

    const wizardFound = await em.findOne(Wizard, query, { populate: ['school'] });

    if (!wizardFound) {
      return res.status(200).json({ message: 'Wizard not found', data: null });
    }

    return res.status(200).json({ message: 'Wizard found', data: wizardFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmailRecipient(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const wizardFound = await em.findOneOrFail(Wizard, { email }, { populate: ['school'] });
    if (!wizardFound) {
      return res.status(409).json({ message: 'Wizard not found', data: null });
    }
    res.status(200).json({ message: 'Wizard found', data: wizardFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id }, { populate: ['school'] });
    if (!wizard) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    }
    res.status(200).json({ message: 'Wizard found', data: wizard });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByEmail(email: string) {
  try {
    const wizard = await em.findOne(Wizard, { email }, { populate: ['school'] });
    return wizard;
  } catch (error: any) {
    return error.message;
  }
}

async function findOneByUser(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const wizard = await em.findOne(Wizard, { username }, { populate: ['school'] });
    if (!wizard) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    } else {
      res.status(200).json({ message: 'Wizard found', data: wizard });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function login(req: Request, res: Response) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const wizardFound = await em.findOne(Wizard, { username }, { populate: ['school'] });

    if (!wizardFound) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    } else {
      const isMatch = await bcrypt.compare(password, wizardFound.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password', data: null });
      }
      const token = jwt.sign({ id: wizardFound.id, role: wizardFound.role }, process.env.SECRET_KEY_WEBTOKEN!, {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', data: { user: wizardFound, token: token } });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function validatePassword(req: Request, res: Response) {
  try {
    const wizardId = req.params.id;
    const currentPassword = req.body.password;
    const wizard = await em.findOne(Wizard, { id: wizardId }, { populate: ['school'] });
    if (!wizard) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    } else {
      const isMatch = await bcrypt.compare(currentPassword, wizard.password);
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
    const wizardFound = await em.findOne(Wizard, { username });
    if (!wizardFound) {
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
    const wizardFound = await em.findOne(Wizard, { email });
    if (!wizardFound) {
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
    const existingWizard = await em.findOne(Wizard, {
      $or: [{ username: req.body.sanitizedInput.username }, { email: req.body.sanitizedInput.email }],
    });

    if (existingWizard) {
      return res.status(409).json({ message: 'Wizard already exists', data: null });
    }
    if (req.body.sanitizedInput.password.length >= 6) {
      const hashRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.sanitizedInput.password, hashRounds);

      const wizard = em.create(Wizard, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
      });

      await em.flush();

      // Remove password from response for security
      const wizardData = { ...wizard, password: undefined };
      res.status(201).json({ message: 'Wizard created successfully', data: wizardData });
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
    const wizardToUpdate = await em.findOneOrFail(Wizard, { id }, { populate: ['school'] });

    if (!wizardToUpdate) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    } else {
      if (req.body.sanitizedInput.password) {
        return res.status(400).json({ message: 'Cannot modify password from update endpoint', data: null });
      }

      // Ensure phone number is stored as string
      const wizardData = {
        ...req.body.sanitizedInput,
        phone: req.body.sanitizedInput.phone ? req.body.sanitizedInput.phone.toString() : wizardToUpdate.phone,
      };

      em.assign(wizardToUpdate, wizardData);

      await em.flush();

      // Remove password from response for security
      const responseData = { ...wizardToUpdate, password: undefined };
      res.status(200).json({ message: 'Wizard updated successfully', data: responseData });
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

    const wizard = await em.findOne(Wizard, { id }, { populate: ['school'] });
    if (!wizard) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    }
    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, hashRounds);
    wizard.password = hashedPassword;
    await em.persistAndFlush(wizard);

    // Remove password from response for security
    const wizardData = { ...wizard, password: undefined };
    return res.status(200).json({ message: 'Password updated successfully', data: wizardData });
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
    const wizard = await em.findOne(Wizard, { id }, { populate: ['school'] });

    if (!wizard) {
      return res.status(404).json({ message: 'Wizard not found', data: null });
    } else {
      await em.removeAndFlush(wizard);
      res.status(200).json({ message: 'Wizard deleted successfully', data: null });
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
