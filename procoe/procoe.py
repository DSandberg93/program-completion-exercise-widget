import ipywidgets as widgets
from traitlets import Unicode, List, observe

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
    user_program_result = Unicode().tag(sync=True)
    solution_program_result = Unicode().tag(sync=True)
    observe("user_program", type="change")

    def __init__(self, **kwargs):
        super(widgets.DOMWidget, self).__init__(**kwargs)
        file = open(kwargs.get("file_path", "r"))
        program = file.read().split("\n")
        file.close()
        self.program = program
        parsed_programs = self.parse_program()
        self.exercise_program = parsed_programs[0]
        self.solution_program = parsed_programs[1]

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
                # solution_program += "".join([str(line_part) for line_part in parsed_solution_line])
                solution_program.append("".join([str(line_part) for line_part in parsed_solution_line]) + "\n")
        return [exercise_program, solution_program]

    @observe("user_program")
    def execute_program(self, change):
        parsed_user_program = "".join([str(line) for line in self.user_program])
        parsed_solution_program = "".join([str(line) for line in self.solution_program])
        try:
            exec(parsed_user_program)
            user_program_result = str(eval(self.user_program[len(self.user_program) - 1]))
            self.user_program_result = user_program_result
        except Exception as ex:
            self.user_program_result = str(ex)
        try:
            exec(parsed_solution_program)
            solution_program_result = str(eval(self.solution_program[len(self.solution_program) - 1]))
            self.solution_program_result = solution_program_result
            # self.solution_program_result = parsed_solution_program
        except Execption as ex:
            self.solution_program_result = "solution program error: " + str(ex)
