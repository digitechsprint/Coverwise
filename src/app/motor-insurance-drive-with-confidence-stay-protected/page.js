
import ScriptRunner from '@/components/ScriptRunner';

export const metadata = {
  title: "Page has moved",
  description: "",
  openGraph: {
    title: "Page has moved",
    description: "",
  }
};

export default function Page() {
  return (
    <ScriptRunner html={"<html><head><!-- /Added by HTTrack -->\n\n\n</head><body></body></html>\n<a href=\"/motor-insurance\"><h3>Click here...</h3></a>\n\n\n\n\n\n"} bodyClass={""} />
  );
}
  