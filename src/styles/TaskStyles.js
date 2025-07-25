const FormWrapper = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const CenteredContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const StyledForm = styled(motion.form)`
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormTitle = styled.h4`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const ErrorBox = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
`;
