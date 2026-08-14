const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    // Format Zod errors
    const errors = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: '400',
      details: errors,
    });
  }
};

export default validateRequest;
