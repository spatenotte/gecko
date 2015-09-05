[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor : EventTarget {
  //Promise<> readDB();
  void logPermissionRequest(request, typesInfo);
};