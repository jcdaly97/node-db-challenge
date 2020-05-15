
exports.up = function(knex) {
    return knex.schema
    .createTable('projects', projects=>{
            projects.increments()

            projects.text('name', 128)
                .notNullable()
                .unique()

            projects.text('description')

            projects.boolean('completed')
                .defaultTo(false)
            
    })

    .createTable('tasks', tasks=>{
            tasks.increments()

            tasks.text('description')
                .notNullable()

            tasks.text('notes')

            tasks.integer('project_id')
                .unsigned()
                .notNullable()
                .references('projects.id')
                .onUpdate('CASCADE')
                .onDelete('RESTRICT')

            tasks.boolean('completed')
                .defaultTo(false)
            
    })

    .createTable('resources', resources=>{

            resources.increments()

            resources.text('name')
                .notNullable()

            resources.text('description')

    })

    .createTable('allocations', allocations=>{
            allocations.increments()

            allocations.integer('project_id')
                .unsigned()
                .notNullable()
                .references('projects.id')
                .onUpdate('CASCADE')
                .onDelete('RESTRICT')

            allocations.integer('resource_id')
                .unsigned()
                .notNullable()
                .references('resources.id')
                .onUpdate('CASCADE')
                .onDelete('RESTRICT')

            allocations.text('notes')

    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('projects')
    .dropTableIfExists('tasks')
    .dropTableIfExists('resources')
    .dropTableIfExists('allocations')
};
