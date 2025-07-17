import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const LeftPane = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    flex: 1;
    background-color: #f8f9fa;
    justify-content: center;
    align-items: center;
  }

  img {
    max-height: 80%;
    padding: 1rem;
    object-fit: contain;
  }
`;

export const RightPane = styled.div`
  flex: 1;
  background-color: #f8f9fa;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const Icon = styled.i`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
`;
