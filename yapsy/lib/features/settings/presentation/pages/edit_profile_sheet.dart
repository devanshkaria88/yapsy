import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../auth/domain/entities/auth_user.dart';
import '../bloc/settings_cubit.dart';

class EditProfileSheet extends StatefulWidget {
  final AuthUser profile;
  const EditProfileSheet({super.key, required this.profile});

  static Future<void> show(BuildContext context, {required AuthUser profile}) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => BlocProvider.value(
        value: context.read<SettingsCubit>(),
        child: EditProfileSheet(profile: profile),
      ),
    );
  }

  @override
  State<EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends State<EditProfileSheet> {
  late final TextEditingController _nameController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.profile.name);
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg, right: AppSpacing.lg, top: AppSpacing.md,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.lg,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)))),
          const SizedBox(height: AppSpacing.lg),
          Text('Edit Profile', style: AppTypography.h2),
          const SizedBox(height: AppSpacing.md),
          TextField(
            controller: _nameController,
            style: AppTypography.body,
            decoration: const InputDecoration(labelText: 'Name'),
          ),
          const SizedBox(height: AppSpacing.md),
          Text('Email: ${widget.profile.email}', style: AppTypography.bodySmall),
          const SizedBox(height: AppSpacing.lg),
          SizedBox(
            width: double.infinity, height: AppSpacing.buttonHeight,
            child: ElevatedButton(
              onPressed: () {
                context.read<SettingsCubit>().updateProfile(name: _nameController.text.trim());
                Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ),
        ],
      ),
    );
  }
}
