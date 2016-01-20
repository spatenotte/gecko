[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor{
  	void notifyListener(DOMString appName, DOMString permission);
  	DOMString getAppName();
};
