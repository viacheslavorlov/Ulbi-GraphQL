const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const users = [
	{id: 1, username: 'Slava', age: 35},
	{id: 2, username: 'Tanya', age: 32}
];
const app = express();
app.use(cors());

const createUser = (input) => {
	const id = Date.now();
	return {
		id,
		username: input.username,
		age: input.age
	}
}

const root = {
	getAllUsers: () => {
		return users;
	},
	getUser: ({id}) => {
		return users.find(user => user.id === id);
	},
	createUser: ({input}) => {
		const user = createUser(input)
		console.log(user)
		users.push(user)
		return user;
	}
}

app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true,
	rootValue: root
}));

app.listen(5000, () => console.log('server start at port 5000'))

