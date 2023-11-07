import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import { generateToken } from "../utils.js";


const router = Router();

/*--------------- esctrategia registro local ---------------*/
//registro al ususario
router.post('/register', passport.authenticate('registerLocalStrategy', 
    {
    failureRedirect: '/api/sessions/fail-register',
    session: false
    }), async (req, res) => {
        res.render('login', {
            style: "login.css",
            message: `Hola, ${req.user.first_name} te has registrado con exito`
        });
    
})
router.get('/fail-register', (req, res) => {
    res.render('register', {
        style: "register.css",
        error: 'Error al registrar el usuario'
    });
})
/*----------------estrategia registro con github----------------*/
//ruta registro con github
router.get('/register-github', passport.authenticate('registerGithubStrategy'))
//ruta collback con github
router.get(config.github.callbackUrl, passport.authenticate('registerGithubStrategy', 
    {
        failureRedirect: '/api/sessions/fail-register',
        session: false
    }), (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res.cookie('authLogin', token, {maxAge: 43200000, httpOnly: true});
    res.redirect('/profile')
})
/*---------------- estrategia login ------------*/

//logueo al usuario sea admin o usuario locales
router.post('/login', passport.authenticate('loginLocalStrategy',
    {
        failureRedirect: '/api/sessions/fail-login',
        session: false
    }), async (req, res) => {
        try {
            const user = req.user;
            const token = generateToken(user);
            res.cookie('cookieLogin', token, {maxAge: 43200000, httpOnly: true});
            res.redirect('/');//redirecciono a home y ya tiene acceso a navegar en la page
        } catch (error) {
            res.render('login', {
                style: "login.css",
                error: 'Credenciales incorrectas'
            });
        }
})
router.get('/fail-login', (req, res) => {
   res.render('login', {
    style: "login.css",
    error: 'Para navegar debe iniciar sesion'
    }); 
})

/*--------------------------------------------------- */

//para eliminar la seccion
router.get('/logout', (req, res) => {
    try {
        res.clearCookie('cookieLogin');
        //una vez cerrada la sesion lo redirige a login
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



export { router as usersSessionsRouter}


