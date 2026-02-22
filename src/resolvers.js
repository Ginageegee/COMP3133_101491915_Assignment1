const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const User = require('./models/User');
const Employee = require('./models/Employee');

const resolvers = {
    Query: {
        async login(_, { input }) {
            const { username, email, password } = input;

            if (!password || (!username && !email)) {
                throw new UserInputError('Username/email and password are required');
            }

            const user = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return { token, user };
        },

        async getAllEmployees(_, __, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');
            return Employee.find();
        },

        async getEmployeeById(_, { eid }, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');
            const emp = await Employee.findById(eid);
            if (!emp) throw new UserInputError('Employee not found');
            return emp;
        },

        async searchEmployees(_, { designation, department }, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');
            const filter = {};
            if (designation) filter.designation = designation;
            if (department) filter.department = department;
            return Employee.find(filter);
        }
    },

    Mutation: {
        async signup(_, { input }) {
            const { username, email, password } = input;

            const existing = await User.findOne({ $or: [{ username }, { email }] });
            if (existing) {
                throw new UserInputError('Username or email already exists');
            }

            const hashed = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                email,
                password: hashed
            });

            await user.save();
            return user;
        },

        async addEmployee(_, { input }, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');

            if (input.salary < 1000) {
                throw new UserInputError('Salary must be >= 1000');
            }

            const emp = new Employee(input);
            await emp.save();
            return emp;
        },

        async updateEmployeeById(_, { eid, input }, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');

            if (input.salary && input.salary < 1000) {
                throw new UserInputError('Salary must be >= 1000');
            }

            const emp = await Employee.findByIdAndUpdate(
                eid,
                { ...input, updated_at: new Date() },
                { new: true }
            );

            if (!emp) throw new UserInputError('Employee not found');
            return emp;
        },

        async deleteEmployeeById(_, { eid }, { user }) {
            if (!user) throw new AuthenticationError('Unauthorized');

            const emp = await Employee.findByIdAndDelete(eid);
            if (!emp) throw new UserInputError('Employee not found');
            return 'Employee deleted successfully';
        }
    }
};

module.exports = resolvers;
