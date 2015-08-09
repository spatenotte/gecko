[JSImplementation="@mozilla.org/b2g-os;1",
 NavigatorProperty="mozOs"]
interface MozOs : EventTarget {
  Promise<DOMString> readFile(DOMString path);
};