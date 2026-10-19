/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Error:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Usuário não encontrado
 *     LoginRequest:
 *       type: object
 *       required: [email, senha]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@ifrs.edu.br
 *         senha:
 *           type: string
 *           format: password
 *           example: 123456
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Ana Souza
 *         email:
 *           type: string
 *           format: email
 *           example: ana.souza@ifrs.edu.br
 *         telefone:
 *           type: string
 *           nullable: true
 *           example: 54999991001
 *         role:
 *           type: string
 *           enum: [admin, voluntario]
 *           example: voluntario
 *         criado_em:
 *           type: string
 *           format: date-time
 *     VolunteerCreate:
 *       type: object
 *       required: [nome, email, senha]
 *       properties:
 *         nome:
 *           type: string
 *           example: Novo Voluntário
 *         email:
 *           type: string
 *           format: email
 *           example: voluntario@ifrs.edu.br
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: senha123
 *         telefone:
 *           type: string
 *           example: 54999999999
 *     UserUpdate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *         telefone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, voluntario]
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Campanha de doação de sangue
 *         descricao:
 *           type: string
 *           nullable: true
 *         local:
 *           type: string
 *           example: Hemocentro Regional
 *         data_inicio:
 *           type: string
 *           format: date-time
 *         data_fim:
 *           type: string
 *           format: date-time
 *         limite_voluntarios:
 *           type: integer
 *           minimum: 1
 *           example: 30
 *         status:
 *           type: string
 *           enum: [agendado, finalizado]
 *         criado_em:
 *           type: string
 *           format: date-time
 *     EventCreate:
 *       type: object
 *       required: [titulo, local, data_inicio, data_fim]
 *       properties:
 *         titulo:
 *           type: string
 *           example: Mutirão ambiental
 *         descricao:
 *           type: string
 *         local:
 *           type: string
 *           example: Parque Municipal
 *         data_inicio:
 *           type: string
 *           format: date-time
 *         data_fim:
 *           type: string
 *           format: date-time
 *         limite_voluntarios:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         status:
 *           type: string
 *           enum: [agendado, finalizado]
 *           default: agendado
 *     EventUpdate:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *         descricao:
 *           type: string
 *           nullable: true
 *         local:
 *           type: string
 *         data_inicio:
 *           type: string
 *           format: date-time
 *         data_fim:
 *           type: string
 *           format: date-time
 *         limite_voluntarios:
 *           type: integer
 *           minimum: 1
 *         status:
 *           type: string
 *           enum: [agendado, finalizado]
 *     Registration:
 *       type: object
 *       properties:
 *         evento_id:
 *           type: integer
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           example: 2
 *         inscrito_em:
 *           type: string
 *           format: date-time
 *     UserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Usuário criado com sucesso
 *         user:
 *           $ref: '#/components/schemas/User'
 *     EventResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Evento criado com sucesso
 *         event:
 *           $ref: '#/components/schemas/Event'
 *     RegistrationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Inscrição realizada com sucesso
 *         registration:
 *           $ref: '#/components/schemas/Registration'
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Dashboard acessado com sucesso
 *         usuario:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             email:
 *               type: string
 *             role:
 *               type: string
 *               enum: [admin, voluntario]
 */
