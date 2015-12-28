[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor{
  object notifyListener(DOMString appName, DOMString permission);
  DOMString getAppName(object request);
};
