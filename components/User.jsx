import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query {
    users {
      id
      name
      password
      cart
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $password: String!, $cart: [String!]!) {
    create(name: $name, password: $password, cart: $cart) {
      id
      name
      password
      cart
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $password: String!
    $cart: [String!]!
  ) {
    update(id: $id, name: $name, password: $password, cart: $cart) {
      id
      name
      password
      cart
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    delete(id: $id) {
      id
    }
  }
`;

const Users = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => refetch(), // Refetch the query after mutation is completed
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => refetch(), // Refetch the query after mutation is completed
  });
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => refetch(), // Refetch the query after mutation is completed
  });
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    cart: [], // Initialize cart as an empty array
  });

  const handleCreateUser = async () => {
    try {
      const { name, password, cart } = formData;
      await createUser({
        variables: { name, password, cart }, // Pass cart directly since it's already an array
      });
      setFormData({ name: "", password: "", cart: [] }); // Reset cart to an empty array
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (id, name, password, cart) => {
    try {
      await updateUser({
        variables: { id, name, password, cart }, // Pass cart directly since it's already an array
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser({
        variables: { id },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChange = (e) => {
    // If the input is for cart, split the value by comma to create an array
    const value =
      e.target.name === "cart" ? e.target.value.split(",") : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Create User</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="password"
        value={formData.password}
        placeholder="Password"
        onChange={handleChange}
      />
      <input
        type="text"
        name="cart"
        value={formData.cart.join(",")} // Join the cart array into a string
        placeholder="Cart (comma-separated)"
        onChange={handleChange}
      />
      <button onClick={handleCreateUser}>Create User</button>

      <h2>All Users</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.name}, Password: {user.password}, Cart: {user.cart.join(",")}
            <button
              onClick={() =>
                handleUpdateUser(user.id, "Updated", "Password", [
                  "UpdatedCart",
                ])
              }
            >
              Update
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
