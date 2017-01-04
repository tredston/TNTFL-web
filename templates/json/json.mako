<%!
import re
def stripNewlines(text):
  return text.replace("\r", "").replace("\n", "")

def collapseWhitespace(text):
  rex = re.compile(r' +')
  return rex.sub(' ', text)
%>Content-Type: application/json

${capture(self.body) | stripNewlines, collapseWhitespace}
