const User = require('../models/Cliente');
var nodemailer = require('nodemailer');

function index(req, res) {
    User.find({})
        .then(users => {
            if (users.length) {
                return res.status(200).send({ users });
            } else {
                return res.send({ message: 'NO CONTENT' });
            }

        }).catch(error => res.status(500).send({ error }));
}

function show(req, res) {
    if (req.body.error) return res.send({ error });
    if (!req.body.users) return res.send({ message: 'NOT FOUND' });
    let users = req.body.users;
    return res.status(200).send({ users });
}

function create(req, res) {
    mensaje = "usuario creado correctamente"
    new User(req.body).save()
        .then(user => {
            res.status(201).send({ mensaje, user })

            var transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: 'ivancaviedes99@outlook.com',
                    pass: 'W4PP2rP3YqTrJv3uaw2K'
                }
            });
            var mailOptions = {
                from: 'ivancaviedes99@outlook.com',
                to: user.email,
                subject: 'Cuenta Creada exitosamente',
                text: `Tu codigo de confirmacion "${user._id}"`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).send(req.body)
                } else {
                    console.log('Email enviado')
                    res.send({ mensaje: 'Correo enviado' })
                }
            });


        })
        .catch(error => res.status(500).send({ error }));
}

function update(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.users) return res.status(404).send({ message: 'NOT FOUND' });
    let user = req.body.users[0];
    user = Object.assign(user, req.body);
    user.save().then(user => res.status(200).send({ message: "UPDATED", user })).catch(error => res.status(500).send({ error }));
}

function remove(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.users) return res.status(404).send({ message: 'NOT FOUND' });
    req.body.users[0].remove().then(user => res.status(200).send({ message: 'REMOVED', user })).catch(error => res.status(500).send({ error }));
}

function find(req, res, next) {
    let query = {};
    query[req.params.key] = req.params.value;
    User.find(query).then(users => {
        if (!users.length) return next();
        req.body.users = users;
        return next();
    }).catch(error => {
        req.body.error = error;
        next();
    })
}

module.exports = {
    index,
    show,
    create,
    update,
    remove,
    find
}