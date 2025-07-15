const awsConfig = {
  Auth: {
    region: "ap-south-1",
    userPoolId: "ap-south-1_8CacKeAQJ",
    userPoolWebClientId: "75qv3ugihum7gs5eg67onof69d",
    oauth: {
      domain: "ap-south-18cackeaqj.auth.ap-south-1.amazoncognito.com",
      scope: ["openid", "email", "profile"],
      redirectSignIn: "http://localhost:5173/",
      redirectSignOut: "http://localhost:5173/",
      responseType: "code", 
    },
  },
};
export default awsConfig;
