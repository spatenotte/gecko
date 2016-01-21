[JSImplementation="@mozilla.org/privacy-monitor;1",
NavigatorProperty="privacyMonitor"]
interface PrivacyMonitor{
  	void notifyListener(DOMString permission);
  	DOMString getAppName();
};
