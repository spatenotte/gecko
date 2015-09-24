[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor{
  void logPermissionRequest(long appID, object typesInfo);
  object readIndexedDB();
};