// Create link_domain and unhealthy_link_domain tables
exports.up = function(knex, Promise) {
  const linkDomainPromise = knex.schema.createTable('link_domain', table => {
    table.increments('id').primary()
    table.text('domain').notNullable().unique().index()
    table.integer('max_usage_count').notNullable()
    table.integer('current_usage_count').notNullable().default(0)
    table.boolean('is_manually_disabled').notNullable().default(false)
    table.timestamp('cycled_out_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  const unhealthyDomainPromise = knex.schema.createTable('unhealthy_link_domain', table => {
    table.increments('id').primary()
    table.text('domain').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())

    table.index(['domain', 'created_at'])
  })

  return Promise.all([linkDomainPromise, unhealthyDomainPromise])
}

// Drop link_domain and unhealthy_link_domain tables
exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('link_domain'),
    knex.schema.dropTable('unhealthy_link_domain')
  ])
}
