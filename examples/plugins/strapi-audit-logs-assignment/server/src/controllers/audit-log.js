'use strict';


module.exports = {

    async find(ctx)
{
      const{ contentType, user, actionType, startDate, endDate, _limit = 10, _start = 0,
       _sort = 'timeStamp::desc'} = ctx.query;

      const filters = {};

      if(contentType)
      {
        filters.contentType = contentType;
      }
      if(user)
      {
        filters.user= { $eq: parseInt(user) };
      }
      if(actionType)
      {
        filters.actionType = actionType;
      }
      if(startDate || endDate)
      {
        filters.timeStamp = {};
      }
      if(startDate)
      {
        filters.timeStamp.$gte = new Date(startDate);
      }
      if(endDate)
      {
        filters.timeStamp.$lte = new Date(endDate);
      }

      const logs = await strapi.db.query('plugin::strapi-audit-logs-assignment.audit-log').findMany({
        where: filters,
        orderBy: _sort.split(',').map(s =>
        {
          const [field, order] = s.split(':');
          return { [field]: order};
        }),
        limit: parseInt(_limit, 10),
        offset: parseInt(_start, 10),
      });

      const count = await strapi.db.query('plugin::strapi-audit-logs-assignment.audit-log').count({
        where: filters
      });

      ctx.body = {
        data: logs,
        meta: { total: count},
      };

}

};
