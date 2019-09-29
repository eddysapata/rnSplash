import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import { Button, Text, Footer, FooterTab } from "native-base";

export default class TabHeader extends React.PureComponent {
  render() {
    const props = this.props;
    const { index } = props.navigation.state;
    return (
      <Footer>
        <FooterTab style={{ backgroundColor: "#1976D2" }}>
          <Button
            style={{ backgroundColor: "#1976D2" }}
            vertical
            active={index === 0}
            onPress={() => props.navigation.navigate("applicantsListNav")}
          >
            <MaterialCommunityIcons
              color={index === 0 ? "#fff" : "lightgray"}
              size={24}
              name="account-multiple"
            />
            <Text>Applicant List</Text>
          </Button>
          <Button
            style={{ backgroundColor: "#1976D2" }}
            vertical
            active={index === 1}
            onPress={() => props.navigation.navigate("clientsListNav")}
          >
            <MaterialCommunityIcons
              color={index === 1 ? "#fff" : "lightgray"}
              size={24}
              name="account-multiple"
            />
            <Text>Clients List</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
