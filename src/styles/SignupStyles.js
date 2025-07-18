import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const ImageContainer = styled.div`
  flex: 1;
  background: #f8f9fa;
  display: none;

  @media(min-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const StyledImage = styled.img`
  max-height: 80%;
  padding: 2rem;
  object-fit: contain;
`;

export const FormContainer = styled.div`
  flex: 1;
  background: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export const StyledForm = styled.form`
  width: 100%;
  max-width: 400px;
`;

export const StyledInputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;

  &.is-invalid {
    border-color: red;
  }
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: -10px;
  left: 10px;
  background: #f8f9fa;
  padding: 0 5px;
  font-size: 0.85rem;
`;

export const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ErrorText = styled.div`
  color: red;
  font-size: 0.875rem;
`;

export const SuccessText = styled.div`
  color: green;
  font-size: 0.875rem;
`;

export const ToggleIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
`;
