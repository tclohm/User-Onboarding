import React, { useState, useEffect } from "react";
import { withFormik, Form, Field, resetForm } from "formik";
import * as Yup from "yup";
import axios from "axios";


const UserForm = (props) => {
	const { values, errors, touched, status } = props

	const [users, setUsers] = useState([]);
	useEffect(() => {
		if(status) {
			setUsers(users => [...users, status])
		}
	}, [status])

	return (
		<div className="user-form">
			<Form>
				<Field 
					type="text"
					name="name"
					placeholder="What's your name?"
					/>
				{touched.name && errors.name &&(<p className="errors">{errors.name}</p>)}
				<Field
					type="text"
					name="email"
					placeholder="What's your email?" 
				/>
				{touched.email && errors.email &&(<p className="errors">{errors.email}</p>)}
				<Field 
					type="password"
					name="password"
					placeholder="Super Secret Password"/>
				{touched.password && errors.password &&(<p className="errors">{errors.password}</p>)}
				<label>
					<Field 
						type="checkbox" 
						name="TOS"
						checked={values.TOS}/>
						Terms of Service
				{touched.TOS && errors.TOS && (<p className="errors">{errors.TOS}</p>)}
				</label>
				<button>Submit</button>
			</Form>

			{users.map( (user, index) => (
				<ul key={index}>
					<li>{user.name}</li>
					<li>{user.email}</li>
				</ul>
			))}
		</div>
	);
};

const FormikUserForm = withFormik({
	mapPropsToValues({name, email, password, TOS}) {
		return {
			name: name || "",
			email: email || "",
			password: password || "",
			TOS: TOS || false,
		};
	},
	validationSchema: Yup.object().shape({
		name: Yup.string().required("Please enter a your name"),
		email: Yup.string()
		.email("Must be a real email address")
		.required("Please enter your email"),
		password: Yup.string()
		.min(6, "Password must be 6 characters or longer")
		.required("Please enter a super secret password"),
		TOS: Yup.boolean().test('TOS', 'You have to agree with our terms of service', value => value === true)
	}),
	handleSubmit(values, {setStatus, resetForm}) {
		axios.post("https://reqres.in/api/users/", values)
				 .then( (response) => {
				 	setStatus(response.data)
				 	console.log(response.data);
				 	resetForm();
			})
				 .catch( (error) => {
				 	console.log("error occurred", error);
				 })
	}
})(UserForm);

export default FormikUserForm;