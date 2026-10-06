import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the student form sections', () => {
  const { container } = render(<App />);
  expect(screen.getByRole('heading', { name: /student form/i })).toBeInTheDocument();

  const legends = Array.from(container.querySelectorAll('.form-section__legend'))
    .map(node => node.textContent)
    .join(' ');

  expect(legends).toMatch(/personal details/i);
  expect(legends).toMatch(/contact/i);
  expect(legends).toMatch(/address/i);
});

test('renders every form field', () => {
  render(<App />);
  expect(screen.getByLabelText(/student name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  expect(screen.getByRole('radiogroup')).toBeInTheDocument();
});