import { useEffect, useState } from "react";
import { getStaff, createStaff } from "../services/staffService";
import "./Staff.css";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: ""
  });

  // Fetch staff on page load
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await getStaff();
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    try {
      const response = await createStaff(formData);
      console.log("Server response:", response.data);

      fetchStaff(); // refresh list after insert

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        salary: ""
      });

    } catch (error) {
      console.error("Error creating staff:", error.response?.data);
    }
  };

  return (
    <>
      <header className="staff-hero">
        <div className="staff-hero-content">
          <h1>Team Directory</h1>
          <p>Manage staff details with ease.</p>
        </div>
      </header>
      <div className="staff-container">
        <div className="card">
          <h2 className="section-title">Staff List</h2>
          <div className="table-wrapper">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.role}</td>
                    <td>{staff.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Add Staff</h2>
          <form className="staff-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-primary">Add Staff</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Staff;
