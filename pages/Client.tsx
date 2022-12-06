import React from "react";
import styles from "../styles/Home.module.css";

const ClientOnly = ({ children, ...delegated }: React.PropsWithChildren) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted)
    return (
      <div className={styles.entryBg}>
        <div className={styles.ldsRoller}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

  return <React.Fragment {...delegated}>{children}</React.Fragment>;
};

export default ClientOnly;
