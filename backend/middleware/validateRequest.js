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
    const rawErrors = error.errors || error.issues || [];
    const errors = rawErrors.map((e) => ({
      path: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
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
