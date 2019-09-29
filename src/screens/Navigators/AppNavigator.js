import React, { Component } from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";

import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";

import TabHeader from "../UI/tabHeader";
import TabBar from "../UI/tabBar";

import AuthScreen from "../Auth/Auth";
import SideBar from "../Sidebar/Sidebar";

import EditProfile from "../EditProfile/EditProfile";

import ClientDetail from "../ClientDetail/ClientDetail";
import ClientsList from "../ClientsList/ClientsList";

import ApplicantsList from "../ApplicantsList/ApplicantsList";
import ApplicantDetail from "../ApplicantDetail/ApplicantDetail";

import NewApplicant from "../NewApplicant/NewApplicant";
import NewClient from "../NewClient/NewClient";
import NewTransaction from "../Transaction/NewTransaction";
import ApplicantTransaction from "../Transaction/ApplicantTransaction";

import { connect } from "react-redux";

const getNavigationConfig = title => ({
  navigationOptions: () => ({
    header: props => <TabHeader {...props} title={title} />
  })
});

const ApplicantsListNav = createStackNavigator(
  {
    applicantsList: {
      screen: ApplicantsList
    },
    applicantsDetail: {
      screen: ApplicantDetail,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true
        };
      }
    },
    applicantTransaction: { screen: ApplicantTransaction },
    newApplicant: { screen: NewApplicant },
    newTransaction: { screen: NewTransaction }
  },
  {
    headerMode: "none",
    initialRouteName: "applicantsList"
  }
);

const ClientsListNav = createStackNavigator(
  {
    clientsList: { screen: ClientsList },
    clientsDetail: {
      screen: ClientDetail,
      navigationOptions: ({ navigation }) => {
        return {
          headerMode: "none",
          gesturesEnabled: true
        };
      }
    },
    newClient: { screen: NewClient }
  },
  {
    headerMode: "none"
  }
);

const mainTab = createMaterialBottomTabNavigator(
  {
    applicantsListNav: {
      screen: ApplicantsListNav,
      navigationOptions: {
        tabBarLabel: "Applicant List",
        tabBarColor: "#4CAF50",
        animationEnabled: true,
        tabBarIcon: (
          <MaterialCommunityIcons
            color="#fff"
            size={24}
            name="account-multiple"
          />
        )
      }
    },
    clientsListNav: {
      screen: ClientsListNav,
      navigationOptions: {
        tabBarLabel: "Client List",
        tabBarColor: "#FF5722",
        tabBarIcon: (
          <MaterialCommunityIcons
            color="#fff"
            size={24}
            name="account-multiple"
          />
        )
      }
    }
  },
  {
    initialRouteName: "applicantsListNav",
    headerMode: "none",
    shifting: true,
    tabBarPosition: "bottom",
    tabBarComponent: props => <TabBar {...props} />,
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index === 0
    })
  }
);

// const AuthStack = createStackNavigator(
//   {
//     Auth: { screen: AuthScreen }
//   },
//   {
//     headerMode: "none",
//     initialRouteName: "Auth"
//   }
// );

export const LandingStack = createDrawerNavigator(
  {
    mainTab: { screen: mainTab },
    editProfile: {
      screen: EditProfile,
      navigationOptions: ({ navigation }) => {
        return {
          gesturesEnabled: true
        };
      }
    }
  },
  {
    headerMode: "none",
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: 298
  }
);

// export const AppNavigator = createSwitchNavigator(
//   {
//     Auth: AuthStack,
//     Landing: LandingStack
//   },
//   {
//     initialRouteName: "Auth"
//   }
// );

export default (Navigator = createStackNavigator(
  {
    Auth: AuthScreen,
    Landing: LandingStack
  },
  {
    initialRouteName: "Auth",
    headerMode: "none"
  }
));

// const mapStateToProps = state => {
//   return {
//     isLoggedIn: state.clients.user.isLoggedIn
//   };
// };

// export default connect(mapStateToProps)(Navigator);
