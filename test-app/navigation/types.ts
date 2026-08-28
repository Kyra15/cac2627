export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Insights: undefined;
  Login: undefined;
};


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}