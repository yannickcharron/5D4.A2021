import dayjs from 'dayjs';
import express from 'express';
import httpErrors from 'http-errors';
import expressRateLimit from 'express-rate-limit';
import expressSlowDown from 'express-slow-down';

import accountRepository from '../repositories/account.repository.js';

import jwtMiddlewares from '../middlewares/authorization.jwt.js';

const router = express.Router();

const limiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max:10,
    message:'Too many requests'
});

const speedLimiter = expressSlowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter:10,
    delayMs:500,
});

class AccountRoutes {
    constructor() {
        router.post('/', this.post);
        router.post('/login', this.login);
        router.post('/refresh', jwtMiddlewares.guardRefreshJWT, this.refreshToken);
        router.get('/secure', jwtMiddlewares.guardAuthorizationJWT, this.secure);
        router.get('/rate-limit', limiter, this.rateLimit);
        router.get('/speed-limit', speedLimiter, this.speedLimit);
        router.delete('/logout', this.logout);
    }

    rateLimit(req, res, next) {
        res.status(200).json(req.rateLimit);
    }

    speedLimit(req, res, next) {
        res.status(200).json(req.slowDown);
    }

    async post(req, res, next) {
       try {
           //TODO: Il faudrait valider les informations avant de les ajouter en base de données (express-validator)
           let account = await accountRepository.create(req.body);
           account = account.toObject({getters:false, virtuals:false});
           account = accountRepository.transform(account);
           res.status(201).json(account);
       } catch(err) {
           return next(httpErrors.InternalServerError(err));
       }
    }

    secure(req, res, next) {
        res.status(200).json(req.user);
    }

    async login(req, res, next) {
       const { username, password } = req.body;
       
       const result = await accountRepository.login(username, password);

       if(result.account) {
            const token = accountRepository.generateJWT(result.account.email);
            res.status(201).json(token);
       } else {
            return next(result.err);
       }
    }

    async refreshToken(req, res, next) {
        const email = req.refreshToken.email
        jwtMiddlewares.revokedRefreshTokens.push(req.body.refreshToken);
        const tokens = accountRepository.generateJWT(email);

        res.status(201).json(tokens);
    }

    async logout(req, res, next) {
     
    }
}

new AccountRoutes();
export default router;