module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

// When fn(req, res, next) is called, it returns a Promise. If this Promise rejects (throws an error), .catch(next) catches the error and passes it to next, which triggers Express's error-handling middleware.