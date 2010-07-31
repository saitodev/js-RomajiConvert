# -*- coding: utf-8 -*-

import sys
import json
from itertools import chain, repeat, izip

def Struct(name, *fields):
  def __init__(self, *args):
    if len(args) > len(fields):
      raise TypeError("__init__() takes at most %d arguments (%d given)" % (len(fields)+1, len(args)+1))
    args = chain(args, repeat(None))
    for field, value in izip(fields, args):
      setattr(self, field, value)

  def to_dict(self):
    result = dict()
    for field in fields:
      result[field] = getattr(self, field)
    return result
    
  attrs = dict()
  attrs["__slots__"] = fields
  attrs["__init__"]  = __init__
  attrs["to_dict"]   = to_dict
  return type(name, (object,), attrs)

Node = Struct("Node", "result", "subtable")

class MyJsonEncoder(json.JSONEncoder):
  def default(self, o):
    if "to_dict" in dir(o):
      return o.to_dict()
    return json.JSONEncoder.default(self, o)  

def decode_utf8(bytes):
  return unicode(bytes, "utf-8")

def load_table(filename):
  with open(filename, "r") as io:
    lines = decode_utf8(io.read())
  return str_to_table(lines)

def str_to_table(lines):
  table = dict()
  for line in lines.splitlines():
    arr = line.split(u"\t");
    arr[1] = arr[1].split(",")
    modify_table(table, *arr)
  return table

def modify_table(table, src, result):
  head = src[0]
  rest = src[1:]
  if not table.has_key(head):
    table[head] = Node()
  if len(rest) == 0:
    table[head].result = result
  else:
    if table[head].subtable == None:
      subtable = dict()
    else:
      subtable = table[head].subtable
    table[head].subtable = modify_table(subtable, rest, result)
  return table

def usage():
  print "usage: mktable.py table_file output_file"
  sys.exit(0)

if __name__ == "__main__":
  if len(sys.argv) < 3:
    usage()
  table = load_table(sys.argv[1])
  msg = """if(typeof RomajiConvert === 'undefined'){
  RomajiConvert = {};
}
RomajiConvert.table = """ + json.dumps(table, cls=MyJsonEncoder) + ";"
  with open(sys.argv[2], 'w') as outfile:
    outfile.write(msg)
    
