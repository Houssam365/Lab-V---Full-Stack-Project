const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajouter les infos du user à la requête
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};
