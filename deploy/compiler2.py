



import os
import re

class MacroStatement:
	ins = "";
	arg = "";
	def __init__(self, line):
		line_macro = line.split(" ")[0];
		if line_macro[0:3] == "///" or line_macro[0:4] == "<!--":
			# we have an instruction.
			
			#get and store the instruction ins and arg:
			if line_macro[0:3] == "///":
				self.ins = line_macro[3:];
				self.arg = " ".join(line.split(" ")[1:]);
			else:
				self.ins = line_macro[4:];
				self.arg = " ".join(line.split(" ")[1:])[:-3]; #remove the -->


#for dir,dirs,files in os.walk("."):
#	if "main.js" in files:
#		maindir = dir;

		

crawled = []; #will be used to check that files are not crawled twice.

def crawl(arg_path, arg_filename):
	
	fullpathstring = os.path.join(arg_path,arg_filename);
	
	# check if we have already crawled this file.
	if fullpathstring in crawled:
		print("Already crawled "+ fullpathstring);
		return "";
	else:
		print("Crawling "+fullpathstring);
		crawled.append(fullpathstring);
		
	
	
	
	typeoffile = ""; #will be used to store the type of file we are currently inside.
	# determine the type of file we are crawling based on the extension. Supported types are HTML or JS
	if arg_filename[-4:].upper()=="HTML" or arg_filename[-3:].upper()=="HTM":
		typeoffile = "HTML";
	elif arg_filename[-2:].upper()=="JS":
		typeoffile = "JS";
	
	
	
	curfile = ""; # will hold the contents of the output of this file;
	
	
	
	# add a line in the output to show what we are busy crawling.
	if(typeoffile == "JS"):
		curfile+= "\n\n\n// #########\t\t Crawling:"+fullpathstring+"\t\t#########\n";
	elif (typeoffile == "HTML"):
		curfile+= "\n\n\n<!--#########\t\t Crawling:"+fullpathstring+"\t\t#########-->\n";
	else:
		print "ERROR: unable to determine the type of file based on extension. .htm .html or .js";
		return "error";
	
	
	# Open the file specified in the arguments
	mf = open(arg_path+"\\"+filename, "r");
	
	mflist = []; #will be used to store array of lines read from the file
	#read the lines from the file.
	for line in mf:
		mflist.append(line);
	
	
	i = 0;
	while i<len(mflist):
		line = mflist[i];
		
		#get the macro statement of the line:
		macro = MacroStatement(line);
		
		if macro.ins == "inc" or macro.ins == "*":
			# INCLUDE FILE - USE RELATIVE PATH
			importingfolder	= os.path.join(arg_path,os.path.split(macro.arg)[0]);
			importingfile	= os.path.split(line[5:].replace("\n",""))[1];
			curfile+= crawl(importingfolder,importingfile);
		elif macro.ins == "inc_abs" or macro.ins == "~":
			# INCLUDE FILE - USE ABSOLUTE PATH
			importingfolder	= os.path.join(".",os.path.split(macro.arg.replace("\n",""))[0]);
			importingfile	= os.path.split(line[5:].replace("\n",""))[1];
			curfile+= crawl(importingfolder,importingfile);
		elif macro.ins == "rem_next_line":
			
		else:
			curfile += line;
		
		
		
		
		
		
		if line[0:3] == "///":
			#INSTRUCTIONS
			if line[3]=="*":
				# IMPORT  using relative path
				
			elif line[3]=="~":
				# IMPORT  using absolute path
				
			elif line[3]==".":
				# Disregard the remainder of this file.
				if filename[-4:]=="html" or filename[-3:]=="htm":
					curfile+= "\n\n\n<!--####### remainder of "+fullpathstring+ " has not been imported ########-->\n";
				elif filename[-2:]=="js":
					curfile+= "\n// ####### remainder of "+fullpathstring+ " has not been imported ########\n";
				print ("halt crawling of "+fullpathstring);
				break;
		i++;
				
	mf.close();
	
	
	return curfile;


	
def getMacro(line):
	
	

def filepart(fn):
	result = fn.replace("\n","").replace("/","\\");
	while "\\" in result:
		result = result[result.find("\\")+1:];
	return result
def folderpart(fn):
	result = fn.replace("\n","").replace("/","\\");
	if "\\" in result:
		result = result[::-1];
		result = result[result.find("\\")+1:];
		result = result[::-1];
		return "\\"+result;
	else:
		return "";




os.chdir("./cc_v03");
result=crawl(".","index.htm");
try:
	resfile = open("index_compiled.htm","w");
	resfile.write(result);
	print("\ndone.");
	print(crawled)
except err:
	print("failed to write compiled result to file");
	print(err);
finally:
	resfile.close();



