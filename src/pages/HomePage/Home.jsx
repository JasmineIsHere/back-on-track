import HeaderBar from "../../components/HeaderBar/HeaderBar";

const HomePage = () => {

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString(undefined, options);

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  const user = "John";

  return (
    <>
      <HeaderBar 
        title={greeting() + ", " + user + "!"} 
        subtitle={formattedDate} />
    </>
  )
}

export default HomePage
