import { HeaderSubtitle, HeaderTitle, HeaderBarDiv } from "."

const HeaderBar = ({title, subtitle}) => {
  return (
      <HeaderBarDiv>
        <HeaderSubtitle>{subtitle}</HeaderSubtitle>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderBarDiv>  )
}

export default HeaderBar