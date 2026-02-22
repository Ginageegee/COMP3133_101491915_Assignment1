const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String
    email: String
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    getEmployeeById(eid: ID!): Employee
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(input: SignupInput!): User!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployeeById(eid: ID!, input: EmployeeInput!): Employee!
    deleteEmployeeById(eid: ID!): String!
  }
`;

module.exports = typeDefs;
