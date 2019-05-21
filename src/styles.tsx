import CSS from 'csstype';

export const styles = {
  button: {
    margin: "10px 10px 10px 0",
    minWidth: '200px'
  } as CSS.Properties,
  title: {
    color: "#fff",
    textDecoration: "none",
  } as CSS.Properties,
  modal: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100vh',
    zIndex: 10000,
    backgroundColor: "#fff",
  } as CSS.Properties,
  right: {
    float: "right",
  } as CSS.Properties,
  big: {
    marginTop: "30vh",
    width: '100%',
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: "80px",
  } as CSS.Properties,
  tableRoot: {
    overflowX: "scroll"
  } as CSS.Properties,
  table: {
    minWidth: "540px"
  } as CSS.Properties,
  input: {
    width: "100%"
  } as CSS.Properties,
};
