import ipywidgets as widgets
from traitlets import Unicode, List, Bool, Dict, observe

@widgets.register
class Procoe(widgets.DOMWidget):

    _model_name = Unicode("ProcoeModel").tag(sync=True)
    _model_module = Unicode("procoe").tag(sync=True)
    _model_module_version = Unicode("^0.1.0").tag(sync=True)
    _view_name = Unicode("ProcoeView").tag(sync=True)
    _view_module = Unicode("procoe").tag(sync=True)
    _view_module_version = Unicode("^0.1.0").tag(sync=True)

    exercise_program = List().tag(sync=True)
    user_program = List().tag(sync=True)
    outputs = Dict().tag(sync=True)
    observe("user_program", type="change")

    def __init__(self, **kwargs):
        super(widgets.DOMWidget, self).__init__(**kwargs)
        file = open(kwargs.get("file_path", "r"))
        program = file.read().split("\n")
        file.close()
        self.program = program
        self.exercise_program, self.solution_program = self.parse_program()
        self.failed_attempt_count = 0

    def parse_program(self):
        exercise_program = []
        solution_program = []
        for i in range(len(self.program) - 1):
            line = self.program[i]
            parsed_exercise_line = []
            parsed_solution_line = []
            if "$)" in line:
                split_line = line.split("$)")
                for left_split in split_line:
                    if "$(" in left_split:
                        right_split = left_split.split("$(")
                        parsed_solution_line.extend(right_split)
                        parsed_exercise_line.append(right_split[1])
                    else:
                        parsed_exercise_line.append(left_split)
                        parsed_solution_line.append(left_split)
            else:
                parsed_exercise_line.append(line)
                parsed_solution_line.append(line)
            exercise_program.append(parsed_exercise_line)
            if (len(line) > 0):
                solution_program.append("".join([str(line_part) for line_part in parsed_solution_line]) + "\n")
        return (exercise_program, solution_program)

    @observe("user_program")
    def execute_program(self, change):
        parsed_user_program = "".join([str(line) for line in self.user_program])
        parsed_solution_program = "".join([str(line) for line in self.solution_program])
        outputs = {
            "user_program": None,
            "result": None,
            "error": None,
            "expected_result": None,
        }

        exec(parsed_solution_program)
        solution_program_output = str(eval(self.parse_last_program_line(self.user_program[len(self.solution_program) - 1])))

        try:
            exec(parsed_user_program)
            user_program_output = str(eval(self.parse_last_program_line(self.user_program[len(self.user_program) - 1])))
            outputs["user_program"] = user_program_output
            if user_program_output == solution_program_output:
                outputs["result"] = True
            else:
                outputs["result"] = False
                self.failed_attempt_count += 1
                if (self.failed_attempt_count >= 5):
                    outputs["expected_result"] = solution_program_output
        except Exception as ex:
            outputs["error"] = str(ex)

        self.outputs = outputs

    def parse_last_program_line(self, program_line):
        if ("print(" in program_line) :
            print_split = program_line.split("print(", 1)
            if (")" in print_split[1]):
                return print_split[0] + print_split[1].rsplit(")", 1)[0] + print_split[1].rsplit(")", 1)[1]
        return program_line
