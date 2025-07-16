import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../../components/Auth/Signup'; 
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/auth', () => ({
  signupUser: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  });

  it('renders the signup form', () => {
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('allows toggling password visibility', () => {
    const passwordInput = screen.getByLabelText('Password');
    const toggleIcon = screen
      .getByLabelText('Password')
      .parentElement.querySelector('i');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});