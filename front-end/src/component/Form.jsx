import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

const input = {
    name: '',
    email: '',
    no: '',
    add: '',
    city: '',
    gender: ''
};

const validate = Yup.object({
    name: Yup.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').required('Please enter your full name'),
    email: Yup.string().trim().email('Enter a valid email').required('Please enter your email'),
    no: Yup.string().trim().matches(/^\d{10}$/, 'Enter a valid 10 digit phone number').required('Please enter your phone number'),
    add: Yup.string().trim().min(5, 'Address looks too short').required('Please enter your address'),
    city: Yup.string().required('Please select a city'),
    gender: Yup.string().oneOf(['male', 'female'], 'Please select a gender').required('Please select a gender')
});

const CITIES = ['Surat', 'Vapi', 'Valsad', 'Navsari', 'Baroda'];

const pretty = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—');

function TextField({ id, label, type = 'text', value, onChange, onBlur, placeholder, error, touched, required }) {
    const invalid = Boolean(error && touched);
    return (
        <div className={`form-field${invalid ? ' has-error' : ''}`}>
            <label htmlFor={id}>
                {label}
                {required ? <span className="req" aria-hidden="true">*</span> : null}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={invalid}
                className={invalid ? 'is-invalid' : ''}
            />
            {invalid ? <span className="error-text" role="alert">{error}</span> : null}
        </div>
    );
}

function Form() {
    const [status, setStatus] = useState(null);
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset, isSubmitting } = useFormik({
        initialValues: input,
        validationSchema: validate,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const res = await fetch('http://localhost:7000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus({ type: 'ok', text: data.status || 'Registered successfully' });
                    resetForm();
                } else {
                    setStatus({ type: 'err', text: data.status || 'Registration failed' });
                }
            } catch (err) {
                setStatus({ type: 'err', text: 'Server error, please try again' });
            } finally {
                setSubmitting(false);
            }
        }
    });

    const keys = Object.keys(input);
    const completion = Math.round((keys.filter(k => String(values[k] ?? '').trim() !== '').length / keys.length) * 100);
    const initials = values.name.trim()
        ? values.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : '?';

    return (
        <div className="form-page">
            <div className="student-form">
                <header className="form-header">
                    <span className="eyebrow">Admission Portal</span>
                    <h1>Student Form</h1>
                    <p className="form-header__sub">Fill in your details below. Fields marked <span className="req">*</span> are required.</p>
                </header>

                <form className="student-form__content" onSubmit={handleSubmit} noValidate>
                    <fieldset className="form-section">
                        <legend className="form-section__legend"><span className="step">1</span> Personal details</legend>
                        <div className="form-grid">
                            <TextField id="name" label="Student Name" required placeholder="Jane Cooper" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} />

                            <div className="form-field full-width">
                                <span className="gender-label" id="gender-label">Gender <span className="req" aria-hidden="true">*</span></span>
                                <div className="gender-options" role="radiogroup" aria-labelledby="gender-label">
                                    {['male', 'female'].map(g => (
                                        <label key={g} className={`radio-card${values.gender === g ? ' is-checked' : ''}`}>
                                            <input type="radio" name="gender" value={g} checked={values.gender === g} onChange={handleChange} onBlur={handleBlur} />
                                            <span>{pretty(g)}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.gender && touched.gender ? <span className="error-text" role="alert">{errors.gender}</span> : null}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-section__legend"><span className="step">2</span> Contact</legend>
                        <div className="form-grid">
                            <TextField id="email" type="email" label="Email" required placeholder="jane@example.com" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} />
                            <TextField id="no" type="tel" label="Phone Number" required placeholder="9876543210" value={values.no} onChange={handleChange} onBlur={handleBlur} error={errors.no} touched={touched.no} />
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-section__legend"><span className="step">3</span> Address</legend>
                        <div className="form-grid">
                            <div className="form-field full-width">
                                <label htmlFor="add">Address <span className="req" aria-hidden="true">*</span></label>
                                <textarea id="add" name="add" rows={3} placeholder="Flat, street, landmark" value={values.add} onChange={handleChange} onBlur={handleBlur} className={errors.add && touched.add ? 'is-invalid' : ''}></textarea>
                                {errors.add && touched.add ? <span className="error-text" role="alert">{errors.add}</span> : null}
                            </div>

                            <div className="form-field full-width">
                                <label htmlFor="city">City <span className="req" aria-hidden="true">*</span></label>
                                <select id="city" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} className={errors.city && touched.city ? 'is-invalid' : ''}>
                                    <option value="">Select City</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.city && touched.city ? <span className="error-text" role="alert">{errors.city}</span> : null}
                            </div>
                        </div>
                    </fieldset>

                    {status ? <p className={`form-status is-${status.type}`} role="status">{status.text}</p> : null}

                    <div className="actions">
                        <button type="button" className="btn-ghost" onClick={handleReset} disabled={isSubmitting}>Reset</button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting…' : 'Submit application'}
                        </button>
                    </div>
                </form>

                <aside className="form-aside" aria-label="Form summary">
                    <div className="summary-avatar" aria-hidden="true">{initials}</div>

                    <div>
                        <p className="summary-name">{values.name || 'Your name'}</p>
                        <p className="summary-mail">{values.email || 'you@example.com'}</p>
                    </div>

                    <div className="summary-meter">
                        <div className="summary-meter__head">
                            <span>Completion</span>
                            <span>{completion}%</span>
                        </div>
                        <div className="summary-meter__track">
                            <div className="summary-meter__bar" style={{ width: `${completion}%` }}></div>
                        </div>
                    </div>

                    <dl className="summary-list">
                        <div className="summary-row"><dt>Phone</dt><dd>{values.no || '—'}</dd></div>
                        <div className="summary-row"><dt>City</dt><dd>{values.city || '—'}</dd></div>
                        <div className="summary-row"><dt>Gender</dt><dd>{pretty(values.gender)}</dd></div>
                        <div className="summary-row"><dt>Address</dt><dd className="truncate">{values.add || '—'}</dd></div>
                    </dl>

                    <p className="summary-note">Your details are sent securely to the admission portal.</p>
                </aside>
            </div>
        </div>
    );
}

export default Form;