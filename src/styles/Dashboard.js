onst DashboardWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f2f4ff, #dbeafe);
  position: relative;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 5%;
  right: 5%;
  width: 250px;
  opacity: 0.05;
  z-index: 0;
`;

const Banner = styled.div`
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: #4f46e5;
  color: #ffffff;
  z-index: 1;
  margin-bottom: 1.5rem;

  .welcome-text {
    text-align: center;
    width: 100%;

    h2 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
      color: #fff;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.75);
    }
  }

  .assign-btn {
    background: #ffffff;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 0.3rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #4f46e5;
    text-decoration: none;

    &:hover {
      background-color: #e0e7ff;
    }
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 1rem 1.5rem;
  z-index: 2;
  overflow: auto;
  min-height: 0;
`;