[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor{
  //Promise<> readDB();
  void logPermissionRequest(long appID, object typesInfo);
};