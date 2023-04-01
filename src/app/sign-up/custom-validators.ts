import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return  null as any ;
      }
      const valid = regex.test(control.value);
      return valid ? null as any : error;
    };
  }
}


export  class CustomValidatorsPassword {
  static match(controlName: string, matchControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const matchControl = controls.get(matchControlName);

      if (!matchControl?.errors && control?.value !== matchControl?.value) {
        matchControl?.setErrors({
          matching: {
            actualValue: matchControl?.value,
            requiredValue: control?.value
          }
        });
        return { matching: true };
      }
      return null;
    };
  }
}
