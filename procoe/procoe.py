import ipywidgets as widgets
from traitlets import Unicode, List

@widgets.register
class Procoe(widgets.DOMWidget):

    _model_name = Unicode('ProcoeModel').tag(sync=True)
    _model_module = Unicode('procoe').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    _view_name = Unicode('ProcoeView').tag(sync=True)
    _view_module = Unicode('procoe').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)

    exercise_program = List().tag(sync=True)

    def __init__(self, **kwargs):
        super(widgets.DOMWidget, self).__init__(**kwargs)
        file = open(kwargs.get('file_path', 'r'))
        program = file.read().split('\n')
        file.close()
        self.program = program
        parsed_programs = self.parseProgram()
        self.exercise_program = parsed_programs[0]
        self.solution_program = parsed_programs[1]

    def parseProgram(self):
        exercise_program = []
        solution_program = ''
        for line in self.program:
            parsed_exercise_line = []
            parsed_solution_line = []
            if '$)' in line:
                split_line = line.split('$)')
                for left_split in split_line:
                    if '$(' in left_split:
                        right_split = left_split.split('$(')
                        parsed_solution_line.extend(right_split)
                        parsed_exercise_line.append(right_split[1])
                    else:
                        parsed_exercise_line.append(left_split)
                        parsed_solution_line.append(left_split)
            else:
                parsed_exercise_line.append(line)
                parsed_solution_line.append(line)
            exercise_program.append(parsed_exercise_line)
            solution_program += ''.join([str(lien_part) for lien_part in parsed_solution_line]) + '\n'
        return [exercise_program, solution_program]
