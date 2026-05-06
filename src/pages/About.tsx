import { Navigate } from "react-router-dom";

// Page fusionnée dans /entreprise — redirection pour préserver les anciens liens.
const AboutPage = () => <Navigate to="/entreprise" replace />;

export default AboutPage;
