module.exports = {
    delay: async (ms) =>
        new Promise((resolve) => {
            setTimeout(resolve, ms);
        }),
};
