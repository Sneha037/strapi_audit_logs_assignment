

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/audit-logs',
      handler: 'audit-log.find',
      config: {
        policies: ['plugin::strapi-audit-logs-assignment.isAuthorized']
      }
    }
  ]
};
