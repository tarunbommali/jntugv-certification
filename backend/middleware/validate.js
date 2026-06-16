export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace req properties with sanitized/coerced values from Zod
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;

    next();
  } catch (error) {
    // ZodError has an .issues array
    const errors = Array.isArray(error.issues)
      ? error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
      : [{ path: '', message: error.message || 'Validation failed' }];

    res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
};
